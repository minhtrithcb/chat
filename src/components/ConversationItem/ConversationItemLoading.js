import React from 'react'
import Skeleton from 'react-loading-skeleton'
import styles from './ConversationItem.module.scss'

const ConversationItemLoading = ({count}) => {
  return (
    <>
        {
            [...Array(count).keys()].map(item => (
                <div className={styles.skeletonItem} key={item}>
                    <div className={styles.left}>
                        <Skeleton circle width={40} height={40} />
                    </div>
                    <div className={styles.right}>
                        <Skeleton width={'60%'} />
                        <Skeleton width={'50%'}  />
                    </div>
                </div>
            ))

        }
    </>
  )
}

export default ConversationItemLoading