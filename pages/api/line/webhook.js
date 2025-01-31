// pages/api/webhook.js
import { Client } from '@line/bot-sdk';
import mysql from 'mysql2/promise';
import crypto from 'crypto';

const config = {
    channelAccessToken: "nWnWPXtcok1IQAXuzZggXDiuENWXc/qlJQ83F7dJYFrE/Z9g/qxXhiTdDjHbB8lkNKsp9jZernoXtRN/+ILYtDAPxJTmbWdyO12I+YoWUX5fIZSe8YV/5bMr3QLNZ1x0lA3Qy81xj1R1xki6olznTAdB04t89/1O/w1cDnyilFU=",
    channelSecret: "a124a86d0cb5a989736be117e6e76788",
};

const client = new Client(config);

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const QUERIES = {
    CREATE_TABLE: `
        CREATE TABLE IF NOT EXISTS tickets (
            id VARCHAR(10) PRIMARY KEY,
            userId VARCHAR(255) NOT NULL,
            displayName VARCHAR(255) NOT NULL,
            issue TEXT NOT NULL,
            status ENUM('pending', 'inProgress', 'resolved', 'closed') DEFAULT 'pending',
            chatEnabled BOOLEAN DEFAULT false,
            groupChatId VARCHAR(255),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `,
    CREATE_TICKET: `
        INSERT INTO tickets (id, userId, displayName, issue, status)
        VALUES (?, ?, ?, ?, 'pending')
    `,
    GET_USER_TICKETS: `
        SELECT * FROM tickets WHERE userId = ?
    `,
    GET_TICKET: `
        SELECT * FROM tickets WHERE id = ? AND userId = ?
    `,
    GET_TICKET_BY_ID: `
        SELECT * FROM tickets WHERE id = ?
    `,
    UPDATE_CHAT_STATUS: `
        UPDATE tickets SET chatEnabled = ? WHERE id = ? AND userId = ?
    `,
    UPDATE_TICKET_GROUP: `
        UPDATE tickets SET groupChatId = ? WHERE id = ?
    `,
    DELETE_TICKET: `
        DELETE FROM tickets WHERE id = ? AND userId = ?
    `,
    CHECK_STAFF: `
        SELECT * FROM staff WHERE userId = ? AND active = true
    `,
    UPDATE_TICKET_STATUS: `
        UPDATE tickets SET status = ? WHERE id = ?
    `,
    CREATE_STAFF_TABLE: `
        CREATE TABLE IF NOT EXISTS staff (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId VARCHAR(255) NOT NULL UNIQUE,
            displayName VARCHAR(255) NOT NULL,
            active BOOLEAN DEFAULT true,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `
};

async function getConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(QUERIES.CREATE_TABLE);
        await connection.execute(QUERIES.CREATE_STAFF_TABLE);
        return connection;
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

async function isStaff(connection, userId) {
    const [staff] = await connection.execute(QUERIES.CHECK_STAFF, [userId]);
    return staff.length > 0;
}

function generateTicketId() {
    return `TK${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

async function createGroupChat(client, connection, ticket, userProfile) {
    try {
        // สร้างกลุ่มแชทใหม่
        const group = await client.post('/group/create', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${client.channelAccessToken}`
            },
            data: {
                name: `Ticket#${ticket.id}_${userProfile.displayName}`
            }
        });

        if (!group || !group.groupId) {
            throw new Error('Failed to create group chat');
        }

        // Update ticket with group ID
        await connection.execute(QUERIES.UPDATE_TICKET_GROUP, [group.groupId, ticket.id]);

        // Get staff members
        const [staffMembers] = await connection.execute('SELECT userId FROM staff WHERE active = true');

        // Send invitation link to customer and staff
        const inviteLink = await client.post(`/group/${group.groupId}/invite`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${client.channelAccessToken}`
            }
        });

        // Send invite link to customer
        await client.pushMessage(ticket.userId, {
            type: 'text',
            text: `กรุณาเข้าร่วมแชทสำหรับ Ticket #${ticket.id} ผ่านลิงก์นี้:\n${inviteLink.url}`
        });

        // Send invite link to all staff
        for (const staff of staffMembers) {
            await client.pushMessage(staff.userId, {
                type: 'text',
                text: `มี Ticket ใหม่ #${ticket.id}\nกรุณาเข้าร่วมแชทผ่านลิงก์นี้:\n${inviteLink.url}`
            });
        }

        // Send welcome message to group
        await client.pushMessage(group.groupId, {
            type: 'text',
            text: `🎫 Ticket #${ticket.id}\n\nลูกค้า: ${userProfile.displayName}\nปัญหา: ${ticket.issue}\n\nเจ้าหน้าที่จะให้บริการผ่านแชทนี้ค่ะ`
        });

        return group.groupId;
    } catch (error) {
        console.error('Error creating group chat:', error);
        throw new Error('ไม่สามารถสร้างห้องแชทได้ กรุณาลองใหม่อีกครั้ง');
    }
}


const welcomeMessage = {
    type: 'flex',
    altText: 'ยินดีต้อนรับสู่ระบบ Support Ticket',
    contents: {
        type: 'bubble',
        hero: {
            type: 'image',
            url: 'https://via.placeholder.com/1000x400',
            size: 'full',
            aspectRatio: '20:8',
            aspectMode: 'cover'
        },
        body: {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'text',
                    text: 'ยินดีต้อนรับสู่ระบบ Support',
                    weight: 'bold',
                    size: 'xl',
                    color: '#1DB446'
                },
                {
                    type: 'text',
                    text: 'กรุณาเลือกบริการที่ต้องการ',
                    size: 'sm',
                    color: '#aaaaaa',
                    margin: 'md'
                }
            ]
        },
        footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'button',
                    style: 'primary',
                    action: {
                        type: 'message',
                        label: 'สร้าง Ticket ใหม่',
                        text: '#ticket'
                    }
                },
                {
                    type: 'button',
                    action: {
                        type: 'message',
                        label: 'ตรวจสอบ Ticket',
                        text: '#status'
                    },
                    style: 'secondary',
                    margin: 'md'
                }
            ]
        }
    }
};

const createTicketPrompt = {
    type: 'flex',
    altText: 'สร้าง Ticket ใหม่',
    contents: {
        type: 'bubble',
        body: {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'text',
                    text: '📝 สร้าง Ticket ใหม่',
                    weight: 'bold',
                    size: 'xl'
                },
                {
                    type: 'text',
                    text: 'กรุณาพิมพ์รายละเอียดปัญหาของคุณ',
                    size: 'sm',
                    color: '#aaaaaa',
                    margin: 'md'
                },
                {
                    type: 'text',
                    text: 'ตัวอย่าง: #ticket ต้องการสอบถามเรื่อง...',
                    size: 'sm',
                    color: '#aaaaaa',
                    margin: 'md'
                }
            ]
        }
    }
};

function createTicketStatusFlex(ticket) {
    const statusColors = {
        pending: '#ff9800',
        inProgress: '#2196f3',
        resolved: '#4caf50',
        closed: '#9e9e9e'
    };

    return {
        type: 'flex',
        altText: `Ticket #${ticket.id} Status`,
        contents: {
            type: 'bubble',
            header: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'text',
                        text: `Ticket #${ticket.id}`,
                        weight: 'bold',
                        size: 'xl',
                        color: '#ffffff'
                    }
                ],
                backgroundColor: statusColors[ticket.status] || '#1DB446'
            },
            body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                            {
                                type: 'text',
                                text: 'สถานะ',
                                size: 'sm',
                                color: '#aaaaaa'
                            },
                            {
                                type: 'text',
                                text: getThaiStatus(ticket.status),
                                size: 'lg',
                                weight: 'bold',
                                margin: 'sm'
                            }
                        ]
                    },
                    {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                            {
                                type: 'text',
                                text: 'รายละเอียด',
                                size: 'sm',
                                color: '#aaaaaa'
                            },
                            {
                                type: 'text',
                                text: ticket.issue,
                                wrap: true,
                                margin: 'sm'
                            }
                        ],
                        margin: 'lg'
                    },
                    {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                            {
                                type: 'text',
                                text: 'วันที่สร้าง',
                                size: 'sm',
                                color: '#aaaaaa'
                            },
                            {
                                type: 'text',
                                text: formatDate(ticket.createdAt),
                                margin: 'sm'
                            }
                        ],
                        margin: 'lg'
                    }
                ]
            },
            footer: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'button',
                        style: 'primary',
                        action: {
                            type: 'message',
                            label: 'คุยกับเจ้าหน้าที่',
                            text: `#chat ${ticket.id}`
                        }
                    },
                    {
                        type: 'button',
                        action: {
                            type: 'message',
                            label: 'ลบ Ticket',
                            text: `#delete ${ticket.id}`
                        },
                        style: 'secondary',
                        margin: 'md',
                        color: '#ff0000'
                    }
                ]
            }
        }
    };
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }

    const events = req.body.events;
    if (!Array.isArray(events) || events.length === 0) {
        res.status(200).json({ message: 'No events to process' });
        return;
    }

    let connection;
    try {
        connection = await getConnection();

        await Promise.all(events.map(async (event) => {
            if (event.type === 'follow') {
                return client.replyMessage(event.replyToken, welcomeMessage);
            }

            if (event.type !== 'message' || event.message.type !== 'text') {
                return null;
            }

            const userId = event.source?.userId;
            const { message, replyToken } = event;

            if (!userId || !event.source?.type === 'user') {
                return null;
            }

            let userProfile;
            try {
                userProfile = await client.getProfile(userId);
            } catch (error) {
                userProfile = { displayName: 'Unknown User' };
            }

            const command = message.text.split(' ')[0].toLowerCase();
            const content = message.text.split(' ').slice(1).join(' ');

            switch (command) {
                case '#ticket':
                    if (!content) {
                        return client.replyMessage(replyToken, createTicketPrompt);
                    }

                    const ticketId = generateTicketId();
                    await connection.execute(QUERIES.CREATE_TICKET, [
                        ticketId,
                        userId,
                        userProfile.displayName,
                        content
                    ]);

                    const [newTicket] = await connection.execute(QUERIES.GET_TICKET, [ticketId, userId]);
                    
                    // Notify staff about new ticket
                    const [staffMembers] = await connection.execute('SELECT userId FROM staff WHERE active = true');
                    for (const staff of staffMembers) {
                        await client.pushMessage(staff.userId, {
                            type: 'text',
                            text: `📫 New Ticket #${ticketId}\nFrom: ${userProfile.displayName}\nIssue: ${content}`
                        });
                    }

                    return client.replyMessage(replyToken, createTicketStatusFlex(newTicket[0]));

                case '#status':
                    const [tickets] = await connection.execute(QUERIES.GET_USER_TICKETS, [userId]);
                    
                    if (tickets.length === 0) {
                        return client.replyMessage(replyToken, {
                            type: 'flex',
                            altText: 'ไม่พบ Ticket',
                            contents: {
                                type: 'bubble',
                                body: {
                                    type: 'box',
                                    layout: 'vertical',
                                    contents: [
                                        {
                                            type: 'text',
                                            text: '❌ คุณยังไม่มี Ticket ที่เปิดไว้',
                                            weight: 'bold'
                                        }
                                    ]
                                }
                            }
                        });
                    }

                    return client.replyMessage(replyToken, {
                        type: 'flex',
                        altText: 'Ticket Status',
                        contents: {
                            type: 'carousel',
                            contents: tickets.map(ticket => createTicketStatusFlex(ticket).contents)
                        }
                    });

                    case '#chat':
                        if (!content) {
                            return client.replyMessage(replyToken, {
                                type: 'text',
                                text: '❌ กรุณาระบุหมายเลข Ticket เพื่อเริ่มการสนทนา'
                            });
                        }
                    
                        const [chatTicket] = await connection.execute(QUERIES.GET_TICKET, [content, userId]);
                        if (chatTicket.length === 0) {
                            return client.replyMessage(replyToken, {
                                type: 'text',
                                text: '❌ ไม่พบ Ticket ที่ระบุ'
                            });
                        }
                    
                        try {
                            if (!chatTicket[0].groupChatId) {
                                try {
                                    await createGroupChat(client, connection, chatTicket[0], userProfile);
                                    return client.replyMessage(replyToken, {
                                        type: 'text',
                                        text: `✅ กำลังสร้างห้องแชทสำหรับ Ticket #${content}\nกรุณารอรับลิงก์เชิญเข้าร่วมแชทค่ะ`
                                    });
                                } catch (error) {
                                    return client.replyMessage(replyToken, {
                                        type: 'text',
                                        text: error.message || '❌ เกิดข้อผิดพลาดในการสร้างห้องแชท กรุณาลองใหม่อีกครั้ง'
                                    });
                                }
                            }
                    
                            return client.replyMessage(replyToken, {
                                type: 'text',
                                text: `✅ มีห้องแชทสำหรับ Ticket #${content} อยู่แล้ว\nหากคุณยังไม่ได้เข้าร่วมแชท กรุณาแจ้งเจ้าหน้าที่เพื่อขอลิงก์เชิญใหม่ค่ะ`
                            });
                        } catch (error) {
                            console.error('Error handling chat:', error);
                            return client.replyMessage(replyToken, {
                                type: 'text',
                                text: '❌ เกิดข้อผิดพลาดในการจัดการแชท กรุณาลองใหม่อีกครั้ง'
                            });
                        }                    

                case '#delete':
                    if (!content) {
                        return client.replyMessage(replyToken, {
                            type: 'text',
                            text: '❌ กรุณาระบุหมายเลข Ticket เพื่อลบ'
                        });
                    }

                    const [deleteTicket] = await connection.execute(QUERIES.GET_TICKET, [content, userId]);
                    if (deleteTicket.length === 0) {
                        return client.replyMessage(replyToken, {
                            type: 'text',
                            text: '❌ ไม่พบ Ticket ที่ระบุ'
                        });
                    }

                    if (deleteTicket[0].groupChatId) {
                        try {
                            await client.leaveGroup(deleteTicket[0].groupChatId);
                        } catch (error) {
                            console.error('Error leaving group:', error);
                        }
                    }

                    await connection.execute(QUERIES.DELETE_TICKET, [content, userId]);
                    return client.replyMessage(replyToken, {
                        type: 'text',
                        text: `✅ ลบ Ticket #${content} เรียบร้อยแล้ว`
                    });

                case '#help':
                    return client.replyMessage(replyToken, welcomeMessage);

                case '#inprogress':
                    if (!content) {
                        return client.replyMessage(replyToken, {
                            type: 'text',
                            text: '❌ กรุณาระบุหมายเลข Ticket เช่น #inprogress TK1234ABCD'
                        });
                    }

                    const staffCheck1 = await isStaff(connection, userId);
                    if (!staffCheck1) {
                        return client.replyMessage(replyToken, {
                            type: 'text',
                            text: '❌ คำสั่งนี้สำหรับเจ้าหน้าที่เท่านั้น'
                        });
                    }

                    const [ticketInProgress] = await connection.execute(QUERIES.GET_TICKET_BY_ID, [content]);
                    if (ticketInProgress.length === 0) {
                        return client.replyMessage(replyToken, {
                            type: 'text',
                            text: '❌ ไม่พบ Ticket ที่ระบุ'
                        });
                    }

                    await connection.execute(QUERIES.UPDATE_TICKET_STATUS, ['inProgress', content]);
                    
                    // Notify customer
                    await client.pushMessage(ticketInProgress[0].userId, {
                        type: 'text',
                        text: `🔄 Ticket #${content} กำลังอยู่ระหว่างดำเนินการโดยเจ้าหน้าที่`
                    });

                    return client.replyMessage(replyToken, {
                        type: 'text',
                        text: `✅ อัพเดทสถานะ Ticket #${content} เป็น "กำลังดำเนินการ" เรียบร้อยแล้ว`
                    });

                case '#resolved':
                    if (!content) {
                        return client.replyMessage(replyToken, {
                            type: 'text',
                            text: '❌ กรุณาระบุหมายเลข Ticket เช่น #resolved TK1234ABCD'
                        });
                    }

                    const staffCheck2 = await isStaff(connection, userId);
                    if (!staffCheck2) {
                        return client.replyMessage(replyToken, {
                            type: 'text',
                            text: '❌ คำสั่งนี้สำหรับเจ้าหน้าที่เท่านั้น'
                        });
                    }

                    const [ticketResolved] = await connection.execute(QUERIES.GET_TICKET_BY_ID, [content]);
                    if (ticketResolved.length === 0) {
                        return client.replyMessage(replyToken, {
                            type: 'text',
                            text: '❌ ไม่พบ Ticket ที่ระบุ'
                        });
                    }

                    await connection.execute(QUERIES.UPDATE_TICKET_STATUS, ['resolved', content]);
                    
                    // Notify customer
                    await client.pushMessage(ticketResolved[0].userId, {
                        type: 'text',
                        text: `✅ Ticket #${content} ได้รับการแก้ไขแล้ว\nหากมีข้อสงสัยเพิ่มเติมสามารถสร้าง Ticket ใหม่ได้ค่ะ`
                    });

                    return client.replyMessage(replyToken, {
                        type: 'text',
                        text: `✅ อัพเดทสถานะ Ticket #${content} เป็น "แก้ไขแล้ว" เรียบร้อยแล้ว`
                    });

                case '#close':
                    if (!content) {
                        return client.replyMessage(replyToken, {
                            type: 'text',
                            text: '❌ กรุณาระบุหมายเลข Ticket เช่น #close TK1234ABCD'
                        });
                    }

                    const staffCheck3 = await isStaff(connection, userId);
                    if (!staffCheck3) {
                        return client.replyMessage(replyToken, {
                            type: 'text',
                            text: '❌ คำสั่งนี้สำหรับเจ้าหน้าที่เท่านั้น'
                        });
                    }

                    const [ticketClose] = await connection.execute(QUERIES.GET_TICKET_BY_ID, [content]);
                    if (ticketClose.length === 0) {
                        return client.replyMessage(replyToken, {
                            type: 'text',
                            text: '❌ ไม่พบ Ticket ที่ระบุ'
                        });
                    }

                    await connection.execute(QUERIES.UPDATE_TICKET_STATUS, ['closed', content]);

                    if (ticketClose[0].groupChatId) {
                        try {
                            await client.pushMessage(ticketClose[0].groupChatId, {
                                type: 'text',
                                text: '🔒 Ticket นี้ถูกปิดแล้ว ขอบคุณที่ใช้บริการค่ะ'
                            });
                            await client.leaveGroup(ticketClose[0].groupChatId);
                        } catch (error) {
                            console.error('Error handling group close:', error);
                        }
                    }

                    // Notify customer
                    await client.pushMessage(ticketClose[0].userId, {
                        type: 'text',
                        text: `🔒 Ticket #${content} ถูกปิดแล้ว\nขอบคุณที่ใช้บริการค่ะ`
                    });

                    return client.replyMessage(replyToken, {
                        type: 'text',
                        text: `✅ อัพเดทสถานะ Ticket #${content} เป็น "ปิดการใช้งาน" เรียบร้อยแล้ว`
                    });

                case '#staffhelp':
                    const staffCheck4 = await isStaff(connection, userId);
                    if (!staffCheck4) {
                        return client.replyMessage(replyToken, {
                            type: 'text',
                            text: '❌ คำสั่งนี้สำหรับเจ้าหน้าที่เท่านั้น'
                        });
                    }

                    return client.replyMessage(replyToken, {
                        type: 'text',
                        text: 'คำสั่งสำหรับเจ้าหน้าที่:\n\n' +
                              '#inprogress [ticket_id] - อัพเดทสถานะเป็น "กำลังดำเนินการ"\n' +
                              '#resolved [ticket_id] - อัพเดทสถานะเป็น "แก้ไขแล้ว"\n' +
                              '#close [ticket_id] - อัพเดทสถานะเป็น "ปิดการใช้งาน"'
                    });

                default:
                    return null;
            }
        }));

        res.status(200).json({ message: 'OK' });
    } catch (err) {
        console.error('Error processing webhook:', err);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

function getThaiStatus(status) {
    const statusMap = {
        pending: '📋 รอดำเนินการ',
        inProgress: '🔄 กำลังดำเนินการ',
        resolved: '✅ แก้ไขแล้ว',
        closed: '🔒 ปิดการใช้งาน'
    };
    return statusMap[status] || status;
}

function formatDate(date) {
    return new Date(date).toLocaleString('th-TH', {
        timeZone: 'Asia/Bangkok'
    });
}