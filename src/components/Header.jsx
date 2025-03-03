import logo from "../assets/images/Logo-Protean.svg";
import notification from "../assets/images/notification-with.svg";
import comments_no from "../assets/images/comment-no-notifi.svg";
import { Menu } from 'primereact/menu';
import React, { useRef } from 'react';

const Logo = () => {
  const userMenu = useRef(null);
  const items = [
    {
      items: [
        {
          label: 'Logout',
          icon: 'pi pi-refresh'
        },
        {
          label: 'Update user caches',
          icon: 'pi pi-upload'
        },
        {
          label: 'Jobs monitoring',
          icon: ''
        }, {
          label: 'Admin Panel',
          icon: ''
        }

      ]
    }
  ];
  return (
    <div className="header flex m-0">
      {/* <Link to="/dashboard" className="d-inline-block"> */}
      <div className="logo ">
        <img src={logo} alt="Logo" width={147} />
      </div>
      {/* </Link> */}
      <div className="p-0 flex flex-grow-1 align-items-center justify-content-end" style={{ height: '72px ' }}>
        <img src={comments_no} alt="Notificaiton" width={34} className="mr-3" />
        <img src={notification} alt="Notificaiton" width={34} className="mr-3" />
        <div className="font-size-sixteen medium-font mr-3" aria-controls="popup_menu_user" aria-haspopup onClick={(ev) => userMenu.current.toggle(ev)} >
          <label>Corp</label>
          <label>, Kode</label>
        </div>
      </div>
      <Menu model={items} ref={userMenu} popup popupAlignment="right" id="popup_menu_user" style={{color:"#333333"}} />
    </div>
  );
};

const Header = () => {
  return (
    <>
      <div className="logo-position">
        <Logo />
      </div>
    </>
  );
};

export default Header;
