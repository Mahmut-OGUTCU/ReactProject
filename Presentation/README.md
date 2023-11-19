
# MERN POS Uygulaması /Frontend

Bu klasör, proje frontend kısmını içeriyor ve inanılmaz kullanıcı deneyimi ile sizi karşılıyor. 
## Özellikler

- **Sayfa Uygulaması (SPA):** Projemiz, mükemmel performans ve sorunsuz gezinme için SPA mimarisini kullanıyor.

- **React Router Dom:** Sayfalar arasında gezinme ve URL tabanlı yönlendirme için en son teknolojiyi kullanıyoruz.

- **Redux Toolkit ile State Management:** Uygulama durumu, Redux Toolkit ile akıllı ve etkili bir şekilde yönetiliyor.

- **React Hooks:** Fonksiyonel bileşenlerdeki state ve lifecycle yönetimi, React Hooks sayesinde zirveye taşınıyor.

- **Tailwind CSS ve Responsive Tasarım:** Kullanıcı arayüzü, şık ve mobil dostu bir tasarım için Tailwind CSS ile oluşturulmuştur.

- **Axios**, basit ve etkili bir şekilde HTTP istekleri yapmak için kullanılan bir kütüphanedir. Projemizde, backend ile iletişim kurmak ve veri alışverişi için Axios kullanılmaktadır. Axios Interceptörleri'ne de yer verilmiştir.
  * **interceptors.request:** Axios'un request interceptor'ları sayesinde, her HTTP isteği öncesi belirli işlemleri gerçekleştirebilirsiniz. Bu, örneğin, her isteğe otomatik olarak JWT token eklemek için kullanılabilir.
  * **interceptors.response:** Response interceptor'ları, sunucudan gelen cevapları işlemek için kullanılır. Örneğin, her cevapta belirli bir hata durumunu kontrol etmek veya başarılı bir cevaptan önce belirli işlemleri gerçekleştirmek için kullanılabilir.
## Ortam Değişkenleri

Bu projeyi çalıştırmak için aşağıdaki ortam değişkenlerini .env dosyanıza eklemeniz gerekecek

`REACT_APP_SERVER_URL` (backend servisi)
  
## Bilgisayarınızda Çalıştırın

Proje dizinine gidin

```bash
  cd ReactProject\Presentation
```

Gerekli paketleri yükleyin

```bash
  npm install
```

İstemciyi çalıştırın

```bash
  npm start
```

  
