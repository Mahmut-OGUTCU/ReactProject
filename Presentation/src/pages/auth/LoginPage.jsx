import { Button, Checkbox, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { Carousel } from "antd";
import AuthCarousel from "../../components/auth/AuthCarousel";
import { appAxios } from "../../helper/appAxios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onFinish = (value) => {
    setLoading(true);
    appAxios
      .post("auth/login", value)
      .then(async (response) => {
        if (response.data.status) {
          localStorage.setItem("token", response.data.data.token);
          localStorage.setItem("email", response.data.data.email);
          localStorage.setItem("kullanici", response.data.data.kullanici);
          localStorage.setItem("admin", response.data.data.isAdmin);
          navigate("/");
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  return (
    <div className="h-screen">
      <div className="flex justify-between h-full">
        <div className="xl:px-20 px-10 w-full flex flex-col h-full justify-center relative">
          <h1 className="text-center text-5xl font-bold mb-2">LOGO</h1>
          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              remember: false,
            }}
          >
            <Form.Item
              label="e-Posta"
              name={"email"}
              rules={[
                {
                  required: true,
                  message: "e-Posta Adresi Boş Bırakılamaz!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Şifre"
              name={"password"}
              rules={[
                {
                  required: true,
                  message: "Şifre Boş Bırakılamaz!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item name={"remember"} valuePropName="checked">
              <div className="flex justify-between">
                <Checkbox>Beni Hatırla</Checkbox>
                <Link to="/">Şifremi Unuttum</Link>
              </div>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                size="large"
                loading={loading}
              >
                Giriş Yap
              </Button>
            </Form.Item>
          </Form>
          <div className="flex justify-center absolute bottom-10 left-0 w-full">
            Bir hesabınız yok mu? &nbsp;
            <Link to="/register" className="text-blue-600">
              Şimdi kayıt ol
            </Link>
          </div>
        </div>
        <div className="xl:w-4/6 lg:w-3/5 md:w-1/2 md:flex hidden bg-[#8535b9] h-full">
          <div className="w-full h-full flex items-center">
            <div className="w-full">
              <Carousel className="!h-full px-6" autoplay>
                <AuthCarousel
                  img="/images/responsive.svg"
                  title="Responsive"
                  desc="Tüm Cihaz Boyutlarıyla Uyumluluk"
                />
                <AuthCarousel
                  img="/images/statistic.svg"
                  title="İstatistikler"
                  desc="Geniş Tutulan İstatistikler"
                />
                <AuthCarousel
                  img="/images/customer.svg"
                  title="Müşteri Memnuniyeti"
                  desc="Deneyim Sonunda Üründen Memnun Müşteriler"
                />
                <AuthCarousel
                  img="/images/admin.svg"
                  title="Yönetici Paneli"
                  desc="Tek Yerden Yönetim"
                />
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
