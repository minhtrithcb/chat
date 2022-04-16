import React, {useEffect, useState } from 'react'
import styles from './Profile.module.scss'
import avatar from '../../assets/images/user.png'
import Button from '../../components/Common/Button/Button'
import { BsBookmarkCheck, BsChatLeftDots ,BsGlobe, BsGenderAmbiguous, BsCalendar2Date } from "react-icons/bs";
import { FiMail } from "react-icons/fi";
import { MdWorkOutline } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import userApi from '../../api/userApi';
import { useParams } from 'react-router-dom';
import useTheme from '../../hooks/useTheme'
import clsx from 'clsx';

const Profile = () => {
  const {theme} = useTheme()
  const [user, setUser] = useState(null)
  const params = useParams()
  const classesDarkMode = clsx(styles.profileContainer,{ 
    [styles.dark]: theme === "dark"
  })

  // Fetch user by id
  useEffect(() => {
    let isMounted = true;   
    const getUser = async () => {
      const {data} = await userApi.getByUserId(params.id)
      if (isMounted) setUser(data);
    }
    getUser()
    return () => { isMounted = false };
  }, [params])
  

  return (
  <div className={classesDarkMode}>
      <div className={styles.main}>
        <div className={styles.heading}>
          <div className={styles.profileBackground}></div>
          <div className={styles.cardHolder}>
            <div className={styles.avatar}>
              <img src={avatar} alt="friend" />
            </div>
            <div className={styles.cardInfo}>
              <h3>{user && user.fullname}</h3>
              <small>{user && user.email}</small>
            </div>
            <div className={styles.cardOption}>
              <Button>
                <BsBookmarkCheck />
              </Button>
              <Button>
                <BsChatLeftDots />
              </Button>
              <Button primary>Chỉnh sửa hồ sơ</Button>
            </div>
          </div>
        </div>

        <ul className={styles.navBar}>
            <li className={styles.active}>Tổng quan</li>
            <li>Bài viết</li>
            <li>Nhóm</li>
            <li>Trang</li>
            <li>Bạn bè</li>
            <li>Sự kiện</li>
        </ul>

        <div className={styles.asideHeading}>
          <h4>Tóm lược</h4>
          <Button primary>Chỉnh sửa</Button>
        </div>
        <section className={styles.summary}>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, nam aliquam quasi pariatur facilis, fuga nesciunt iure enim quae cumque ut eius unde fugiat totam voluptatibus quam aspernatur laborum quas vitae molestias aperiam ipsum dicta deserunt! Ipsam eius doloremque ab? Accusantium iure dignissimos fugit veritatis dolore deserunt ducimus consequatur totam.
          </p>
        </section>
      </div>

      <div className={styles.aside}>
        <div>
          <div className={styles.asideHeading}>
            <h4>Sở thích</h4>
            <Button primary>Chỉnh sửa</Button>
          </div>
          <div className={styles.asideTags}>
            <span>Thú cưng</span>
            <span>Đá bóng</span>
            <span>Bóng rổ</span>
            <span>Phim Truyền hình</span>
            <span>Du lịch</span>
            <span>Ăn uống</span>
            <span>Công nghệ</span>
          </div>
        </div>

        <div>
          <div className={styles.asideHeading}>
            <h4>Thông tin</h4>
            <Button primary>Chỉnh sửa</Button>
          </div>

          <ul className={styles.asideUl}>
            <li>
              <FiMail />
              <span>
                <p>Email</p> 
                <small>minhtrithcb@gmail.com</small>
              </span>
            </li>
            <li>
              <BsGlobe />
              <span>
                <p>Ngôn ngữ</p> 
                <small>Tiếng Anh, Tiếng Việt</small>
              </span>
            </li>
            <li>
              <BsGenderAmbiguous />
              <span>
                <p>Giới tính</p> 
                <small>Nam</small>
              </span>
            </li>
            <li>
              <BsCalendar2Date />
              <span>
                <p>Ngày gia nhập</p> 
                <small>02/02/2022</small>
              </span>
            </li>
            <li>
              <MdWorkOutline />
              <span>
                <p>Nơi làm việc</p> 
                <small>Google</small>
              </span>
            </li>
            <li>
              <IoDocumentTextOutline />
              <span>
                <p>Nơi Học tập</p> 
                <small>Cao đẳng FPT Polytechnic</small>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Profile