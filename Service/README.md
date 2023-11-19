
# MERN POS Uygulaması /Backend

Bu klasör, projenin backend kısmını içerir ve gerçek bir teknoloji harikasıdır.


## Özellikler

- **MongoDB:** Veritabanı olarak MongoDB kullanılarak, veri yönetimi ve performans en üst düzeye çıkarılmıştır.

- **CRUD API'leri:** Kategoriler, ürünler ve siparişler için özel olarak tasarlanmış CRUD API'leri sayesinde, veri yönetimi muazzam bir hız kazanıyor.

- **Kimlik Doğrulama ve Yetkilendirme:** JWT tabanlı kimlik doğrulama ve yetkilendirme sistemi, kullanıcıların güvenliğini sağlamak için kullanılıyor.


## Ortam Değişkenleri

Bu projeyi çalıştırmak için aşağıdaki ortam değişkenlerini .env dosyanıza eklemeniz gerekecek

`MONGO_URI` (mongodb bağlantısı)
## Bilgisayarınızda Çalıştırın

Proje dizinine gidin

```bash
  cd ReactProject\Service
```

Gerekli paketleri yükleyin

```bash
  npm install
```

Sunucuyu çalıştırın

```bash
  node app.js
```

  
## API Kullanımı

- Tüm istekler güvenlik açısından POST isteği ile yapılmıştır.
- İstemcideki aktif kullanıcı CRUD (create, read, update, delete) işlemleri için herhangi birini gerçekleştirmeye çalışması durumunda eğer JWT ile oluşturulmuş token geçersizse veya token yok ise istekler gerçekleştirmeyecektir.
- Delete işlemleri yetkilendirme sayesinde sadece Admin kullanıcılarına aittir.

#### Tüm öğeleri getir

```http
  POST /api/category/category-get
```

|   Header  | Tip      | Açıklama                |
| :-------- | :------- | :--------------------------------------------  |
|  `token`  | `string` | **Gerekli**. Login yapınca oluşan token değeri. |

| Body | Tip     | Açıklama                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | Tek kayıt isteniyorsa id boş bırakılabilir veya gönderilmez. |
 
#### Öğeyi getir

```http
  POST /api/product/product-get
```
|   Header  | Tip      | Açıklama                |
| :-------- | :------- | :--------------------------------------------  |
|  `token`  | `string` | **Gerekli**. Login yapınca oluşan token değeri. |

| Body | Tip     | Açıklama                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | Tek kayıt isteniyorsa id gönderilmeli. |


  ```http
  POST /api/category/category-add
```
|   Header  | Tip      | Açıklama                |
| :-------- | :------- | :--------------------------------------------  |
|  `token`  | `string` | **Gerekli**. Login yapınca oluşan token değeri. |

| Body | Tip     | Açıklama                       |
| :-------- | :------- | :-------------------------------- |
| `firstname`      | `string` | **Gerekli**. Girilecek string ifade. |
| `lastname`      | `string` | **Gerekli**. Girilecek string ifade. |
| `email`      | `string` | **Gerekli**. Girilecek string ifade. |
| `password`      | `string` | **Gerekli**. Girilecek string ifade. |

**Not:** password değeri hashlenmekt ```bcrypt``` ile şifrelenmektedir.
