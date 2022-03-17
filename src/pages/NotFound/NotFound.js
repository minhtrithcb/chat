import React from 'react'
import { useNavigate } from 'react-router-dom';
import NotFoundPic from '../../assets/images/illu/undraw_page_not_found_re_e9o6.svg';
import Button from '../../components/Button/Button';
import styles from './NotFount.module.scss'
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.NotFound}>
      <img src={NotFoundPic} alt="Notfound" />
      
      <div className={styles.pageDes}>
        <h1>Trang bạn tìm kiếm hiện không khả dụng !</h1>
        <Button primary onClick={() => navigate(-1)}>Quay về</Button>
      </div>
    </div>
  )
}

export default NotFound