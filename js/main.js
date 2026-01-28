
// Floating AI Chatbot Widget

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
if (!document.getElementById('hp-chatbot')) {
	const chatbotBtn = document.createElement('button');
	chatbotBtn.id = 'hp-chatbot';
	chatbotBtn.innerHTML = '<span style="font-family: Great Vibes, cursive; font-size: 1.5rem;">💬</span>';
	chatbotBtn.style.position = 'fixed';
	chatbotBtn.style.bottom = '32px';
	chatbotBtn.style.right = '32px';
	chatbotBtn.style.background = 'linear-gradient(135deg, #b80038 60%, #f7cac9 100%)';
	chatbotBtn.style.color = '#fff';
	chatbotBtn.style.border = 'none';
	chatbotBtn.style.borderRadius = '50%';
	chatbotBtn.style.width = '64px';
	chatbotBtn.style.height = '64px';
	chatbotBtn.style.boxShadow = '0 4px 24px rgba(184,0,56,0.2)';
	chatbotBtn.style.zIndex = '9999';
	chatbotBtn.style.cursor = 'pointer';
	chatbotBtn.title = 'Chat with Heart & Petal';
	document.body.appendChild(chatbotBtn);

	// Chatbot modal
	const modal = document.createElement('div');
	modal.id = 'hp-chatbot-modal';
	modal.style.display = 'none';
	modal.style.position = 'fixed';
	modal.style.bottom = '110px';
	modal.style.right = '32px';
	modal.style.width = '340px';
	modal.style.maxWidth = '90vw';
	modal.style.background = '#fff';
	modal.style.borderRadius = '1rem';
	modal.style.boxShadow = '0 8px 32px rgba(44,44,44,0.18)';
	modal.style.zIndex = '10000';
	modal.innerHTML = `
		<div style="background: linear-gradient(135deg, #b80038 60%, #f7cac9 100%); color: #fff; border-radius: 1rem 1rem 0 0; padding: 1rem; display: flex; align-items: center; gap: 0.5rem;">
			<img src='https://res.cloudinary.com/dij2fdtw4/image/upload/v1769603941/logofile_fsd1cx.png' alt='Heart & Petal' style='height: 2.5rem; width: 2.5rem; border-radius: 50%; background: #fff; object-fit: cover; padding: 0.15rem;'>
			<span style="font-family: 'Playfair Display', serif; font-size: 1.2rem;">Heart & Petal AI Chat</span>
			<button id="hp-chatbot-close" style="margin-left:auto; background:none; border:none; color:#fff; font-size:1.2rem; cursor:pointer;">&times;</button>
		</div>
		<div id="hp-chatbot-messages" style="height: 220px; overflow-y: auto; padding: 1rem; font-family: Montserrat, Arial, sans-serif; font-size: 1rem; background: #fff; color: #222;"></div>
		<form id="hp-chatbot-form" style="display: flex; border-top: 1px solid #eee;">
			<input id="hp-chatbot-input" type="text" placeholder="Type your question..." style="flex:1; border:none; padding:0.75rem; font-size:1rem; border-radius:0 0 0 1rem; outline:none;">
			<button type="submit" style="background:#b80038; color:#fff; border:none; padding:0 1.2rem; font-size:1.1rem; border-radius:0 0 1rem 0; cursor:pointer;">Send</button>
		</form>
	`;
	document.body.appendChild(modal);

	chatbotBtn.onclick = () => {
		modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
	};
	document.getElementById('hp-chatbot-close').onclick = () => {
		modal.style.display = 'none';
	};

	// Simple AI logic
	const messages = document.getElementById('hp-chatbot-messages');
	const form = document.getElementById('hp-chatbot-form');
	const input = document.getElementById('hp-chatbot-input');
	function addMsg(msg, from) {
		const div = document.createElement('div');
		div.style.margin = '0.5rem 0';
		div.style.textAlign = from === 'user' ? 'right' : 'left';
		div.innerHTML = `<span style="display:inline-block; background:${from==='user'?'#f7cac9':'#f1f1f1'}; color:#222; padding:0.5rem 1rem; border-radius:1rem; max-width:80%;">${msg}</span>`;
		messages.appendChild(div);
		messages.scrollTop = messages.scrollHeight;
	}
	form.onsubmit = function(e) {
		e.preventDefault();
		const q = input.value.trim();
		if (!q) return;
		addMsg(q, 'user');
		input.value = '';
		setTimeout(() => {
			let reply = '';
			if (/order|track|where|status/i.test(q)) {
				reply = 'To check your order status, please log in to your account or contact us at <a href="mailto:orders@heartandpetal.com" style="color:#b80038;">orders@heartandpetal.com</a>.';
			} else if (/refund|return|problem|issue|broken|damaged/i.test(q)) {
				reply = 'We’re sorry to hear that! Please email <a href="mailto:support@heartandpetal.com" style="color:#b80038;">support@heartandpetal.com</a> with your order details and we’ll help right away.';
			} else if (/contact|email|phone|help/i.test(q)) {
				reply = 'You can reach us at <a href="mailto:contact@heartandpetal.com" style="color:#b80038;">contact@heartandpetal.com</a> or use this chat for quick questions!';
			} else if (/discount|promo|code|newsletter/i.test(q)) {
				reply = 'Sign up for our newsletter to receive exclusive discounts!';
			} else if (/hi|hello|hey|greetings/i.test(q)) {
				reply = 'Hello! How can I help you today?';
			} else if (/thank/i.test(q)) {
				reply = 'You’re very welcome! If you need anything else, just ask.';
			} else {
				reply = 'I’m your Heart & Petal assistant! I can help with orders, products, and general questions. For anything urgent, please email <a href="mailto:contact@heartandpetal.com" style="color:#b80038;">contact@heartandpetal.com</a>.';
			}
			addMsg(reply, 'bot');
		}, 600);
	};
}
