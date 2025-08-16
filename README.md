click on this link to open this project:
https://wander-lust-1up2.onrender.com

# 🌍 Wander Lust

A **full-stack Airbnb-style web application** built using the **MERN stack** (without React), where users can explore, create, and manage property listings. It supports authentication, authorization, image storage, interactive maps, and deployment on **Render**.

---

## 🚀 Features

* **User Authentication & Authorization**

  * Sign up, log in, and log out functionality using **Passport.js**.
  * Authorization ensures only owners can edit or delete their listings.

* **Listings & Reviews**

  * Create, view, update, and delete property listings.
  * Upload multiple images for listings via **Multer** + **Cloudinary**.
  * Add, edit, and delete reviews for listings.

* **Interactive Maps**

  * Integrated **Mapbox SDK** for location-based map rendering.
  * View exact location of listings.

* **UI & Templates**

  * Built using **EJS** templating engine.
  * Styled with **Bootstrap** for responsiveness.

* **Database**

  * **MongoDB Atlas** cloud database integration.

* **Deployment**

  * Fully deployed on **Render** for production hosting.

---

## 🛠️ Tech Stack

* **Frontend**: EJS, Bootstrap, Vanilla JavaScript
* **Backend**: Node.js, Express.js
* **Database**: MongoDB Atlas (via Mongoose)
* **Authentication**: Passport.js & Passport-Local-Mongoose
* **Image Storage**: Cloudinary + Multer
* **Maps**: Mapbox SDK
* **Deployment**: Render

---

## 📂 Project Structure

```
wanderlust/
│── models/        # Mongoose models (User, Listing, Review)
│── routes/        # Express routes (listings, reviews, auth)
│── controllers/   # Controller logic
│── views/         # EJS templates
│── public/        # Static files (CSS, JS, images)
│── utils/         # Custom utilities & error handling
│── app.js         # Main Express app
│── package.json   # Dependencies & scripts
│── .env           # Environment variables
```

---

## ⚙️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/wanderlust.git
   cd wanderlust
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root with:

   ```env
   CLOUD_NAME=your_cloud_name
   CLOUD_API_KEY=your_cloudinary_key
   CLOUD_API_SECRET=your_cloudinary_secret

   MAP_TOKEN=your_mapbox_token

   ATLASDB_URL=your_mongodb_atlas_url

   SECRET=your_session_secret
   ```

4. **Run the app locally**

   ```bash
   node app.js
   ```

   Visit: [http://localhost:8080/listing](http://localhost:8080/listing)

---



## 👨‍💻 Author

**Asad ur Rehman**

