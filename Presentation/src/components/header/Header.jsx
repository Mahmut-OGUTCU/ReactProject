import React from 'react'
import { SearchOutlined, HomeOutlined, ShoppingCartOutlined, CopyOutlined, UserOutlined, BarChartOutlined, LogoutOutlined } from '@ant-design/icons';
import { Input } from 'antd';

const Header = () => {
    return (
        <div className='border-b mb-6'>
            <header className='header py-4 px-6 flex justify-between items-center gap-10'>
                <div className='logo'>
                    <a href="/">
                        <h2 className='text-2xl font-bold md:text-4xl'>LOGO</h2>
                    </a>
                </div>
                <div className='header-search flex-1'>
                    <Input size="large" placeholder="Ürün Arama..." prefix={<SearchOutlined />} className='rounded-full max-w-[800px]' />
                </div>
                <div className='menu-links flex justify-between items-center gap-7'>
                    <a href="/" className='menu-link flex flex-col items-center hover:text-[#40a9ff]'>
                        <HomeOutlined className='md:text-2xl text-xl' />
                        <span className='md:text-xs text-[10px]'>Ana Sayfa</span>
                    </a>
                    <a href="/" className='menu-link flex flex-col items-center hover:text-[#40a9ff]'>
                        <ShoppingCartOutlined className='md:text-2xl text-xl' />
                        <span className='md:text-xs text-[10px]'>Sepet</span>
                    </a>
                    <a href="/" className='menu-link flex flex-col items-center hover:text-[#40a9ff]'>
                        <CopyOutlined className='md:text-2xl text-xl' />
                        <span className='md:text-xs text-[10px]'>Faturalar</span>
                    </a>
                    <a href="/" className='menu-link flex flex-col items-center hover:text-[#40a9ff]'>
                        <UserOutlined className='md:text-2xl text-xl' />
                        <span className='md:text-xs text-[10px]'>Müşteriler</span>
                    </a>
                    <a href="/" className='menu-link flex flex-col items-center hover:text-[#40a9ff]'>
                        <BarChartOutlined className='md:text-2xl text-xl' />
                        <span className='md:text-xs text-[10px]'>İstatikler</span>
                    </a>
                    <a href="/" className='menu-link flex flex-col items-center hover:text-[#40a9ff]'>
                        <LogoutOutlined className='md:text-2xl text-xl' />
                        <span className='md:text-xs text-[10px]'>Çıkış</span>
                    </a>
                </div>
            </header>
        </div>
    )
}

export default Header