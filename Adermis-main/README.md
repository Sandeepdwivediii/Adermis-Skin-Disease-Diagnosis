# Skin Disease Prediction Web App

A full-stack AI-powered web application to predict skin diseases from user-uploaded images and provide follow-up analysis and treatment recommendations.

---

## 📌 Features

- Skin image analysis using a pre-trained deep learning model.
- Follow-up questions for refining diagnosis via custom logic or ML.
- Disease-specific solution page with Ayurvedic, home remedies, OTC, and prescription treatments.
- Built using Next.js, TailwindCSS, and Python backend (Flask/FastAPI).
- Secure client-server communication with binary-encoded requests and responses.

---

## Architecture Overview

Frontend (Next.js) <--> API Gateway <--> ML Server (Python)
                                        |
                                        --> Image Classification Model
                                        --> Follow-up Logic Handler

---


## Getting Started

## # 1. Clone the repository

Using git clone command clone the repository

## # 2. Set up the backend

cd backend
pip install -r requirements.txt
python app.py


## # 3. Set up the frontend

cd ../frontend
npm install
npm run dev

---

## 📝 Treatment Format

The final solution page displays treatments in this order:

1. **Ayurvedic Solution** 🪔
2. **Home Remedies** 🏡
3. **Over-the-counter (OTC)** 💊
4. **Prescription Drugs** 🧾

Each with a short 1–2 line explanation.

---

## 🧪 Testing

To test the model and flow:

1. Upload a valid image of a skin condition.
2. Fill follow-up form (dynamic based on prediction).
3. View final disease + treatments on `/solution`.

---

## 📚 Future Enhancements

- User authentication and history tracking
- Multilingual support for rural accessibility
- Integration with dermatologists or telehealth platforms
- Feedback loop for improving model accuracy

---

## 👨‍⚕️ Disclaimer

This app is for **educational and informational purposes only**. It is **not a substitute for professional medical advice**. Always consult a certified dermatologist for real-world concerns.

---

## 🧑‍💻 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/xyz`
3. Commit your changes: `git commit -am 'Add xyz'`
4. Push to the branch: `git push origin feature/xyz`
5. Submit a pull request