/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"IBM Plex Sans Thai"', 'sans-serif'],
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
	safelist: [
		'disperse-effect' // Add this line
	  ],
};
