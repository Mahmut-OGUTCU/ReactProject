// NotFound.js
import React from "react";
import { Link } from "react-router-dom";
import "../NotFound.css"; // Ekstra CSS stil dosyası

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1 className="baslik">404 - Sayfa Bulunamadı</h1>
        <p className="paragraf">Üzgünüz, istediğiniz sayfa bulunamadı.</p>
        <Link className="link" to="/">
          Ana Sayfa'ya dön
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
