import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const useIPCheck = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.error) throw new Error('ไม่สามารถตรวจสอบ IP ได้');

      const isThaiIP = data.country_code === 'TH';
      const isCloudflare = data.org?.toUpperCase().includes('CLOUDFLARENET');
      
      setResult({
        ip: data.ip,
        isThailand: isThaiIP,
        isCloudflare,
        country: data.country_name,
        city: data.city,
        region: data.region,
        org: data.org
      });
      
      if (!isThaiIP || isCloudflare) {
        toast.error(isCloudflare ? 'ไม่สามารถใช้งานผ่าน Cloudflare ได้' : 'IP ของคุณไม่ได้มาจากประเทศไทย');
        return false;
      }
      return true;
    } catch (err) {
      toast.error('เกิดข้อผิดพลาดในการตรวจสอบ IP');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkIP();
  }, []);

  return { result, loading, checkIP };
};