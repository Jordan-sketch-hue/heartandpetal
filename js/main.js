// Heart & Petal Main JavaScript  
// Note: Chatbot functionality now handled by chatbot.js

// One-time 20% Discount Popup
if (!localStorage.getItem('hp_newsletter_popup')) {
	setTimeout(() => {
		const popup = document.createElement('div');
		popup.id = 'hp-newsletter-popup';
		popup.style.position = 'fixed';
		popup.style.top = '0';
		popup.style.left = '0';
		popup.style.width = '100vw';
		popup.style.height = '100vh';
		popup.style.background = 'rgba(44,44,44,0.45)';
		popup.style.zIndex = '10001';
		popup.innerHTML = `
			<div style="max-width: 380px; margin: 8vh auto; background: #fff; border-radius: 1.5rem; box-shadow: 0 8px 32px rgba(44,44,44,0.18); padding: 2.5rem 2rem 2rem 2rem; text-align: center; position: relative; font-family: Montserrat, Arial, sans-serif;">
				<button id='hp-newsletter-close' style='position:absolute;top:1rem;right:1rem;background:none;border:none;font-size:1.5rem;color:#b80038;cursor:pointer;'>&times;</button>
				<img src='https://res.cloudinary.com/dij2fdtw4/image/upload/samples/logo.png' alt='Heart & Petal' style='height: 3rem; margin-bottom: 1rem;'>
				<h2 style="font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #b80038; margin-bottom: 0.5rem;">Get 20% Off!</h2>
				<p style="margin-bottom: 1.2rem;">Sign up for our newsletter and enjoy a one-time 20% discount on your first order.</p>
				<form id='hp-newsletter-form' style='display:flex;gap:0.5rem;justify-content:center;'>
					<input id='hp-newsletter-email' type='email' required placeholder='Your email' style='flex:1; padding:0.5rem 1rem; border:1px solid #b80038; border-radius:0.5rem 0 0 0.5rem; font-size:1rem;'>
					<button type='submit' style='background:#b80038; color:#fff; border:none; padding:0 1.2rem; font-size:1rem; border-radius:0 0.5rem 0.5rem 0; cursor:pointer;'>Claim</button>
				</form>
				<div id='hp-newsletter-success' style='display:none; color:#1a7f3c; margin-top:1rem;'>Thank you! Your discount code is <b>LOVE20</b>.</div>
			</div>
		`;
		document.body.appendChild(popup);
		document.getElementById('hp-newsletter-close').onclick = () => {
			popup.remove();
			localStorage.setItem('hp_newsletter_popup', 'closed');
		};
		document.getElementById('hp-newsletter-form').onsubmit = function(e) {
			e.preventDefault();
			const email = document.getElementById('hp-newsletter-email').value.trim();
			if (email) {
				localStorage.setItem('hp_newsletter_popup', email);
				document.getElementById('hp-newsletter-form').style.display = 'none';
				document.getElementById('hp-newsletter-success').style.display = 'block';
				setTimeout(() => popup.remove(), 3000);
			}
		};
	}, 2000);
}
