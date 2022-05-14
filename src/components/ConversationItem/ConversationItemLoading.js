import React from 'react'
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import useTheme from '../../hooks/useTheme'
import styles from './ConversationItem.module.scss'

const ConversationItemLoading = ({count}) => {
    const {theme, themeConver} = useTheme()

    return (
        <>
            {
                [...Array(count).keys()].map(item => (
                    <div className={styles.skeletonItem} key={item}>
                        <SkeletonTheme 
                            baseColor={theme === "dark" ? "#2f334d" : ""} 
                            highlightColor={theme === "dark" ?"#292c43" : ""}
                        >
                            {themeConver === 'default' && <div className={styles.left}>
                                <Skeleton circle width={40} height={40} />
                            </div>}
                            {themeConver === 'default' ? 
                            <div className={styles.right}>
                                <Skeleton width={'60%'} />
                                <Skeleton width={'50%'}  />
                            </div>: 
                            <div className={styles.right}>
                                <Skeleton width={'100%'} />
                                <Skeleton width={'90%'}  />
                            </div>
                            }
                        </SkeletonTheme>
                    </div>
                ))

            }
        </>
    )
}

export default ConversationItemLoading