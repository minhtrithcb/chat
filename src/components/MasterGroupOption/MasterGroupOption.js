import styles from './MasterGroupOption.module.scss'
import OptionEdit from './OptionEdit';
import OptionMute from './OptionMute';
import OptionDelete from './OptionDelete';
import useDecodeJwt from '../../hooks/useDecodeJwt';
import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import useTheme from '../../hooks/useTheme';
import clsx from 'clsx';

const MasterGroupOption = () => {
    const {currentChat } = useContext(ChatContext)
    const [currentUser] = useDecodeJwt()
    const {theme} = useTheme()
    const classesDarkMode = clsx(styles.groupOption, { 
        [styles.dark]: theme === "dark"
    })

    return (
        <div className={classesDarkMode}>
            {currentChat.owner === currentUser.id && 
                <>
                    <OptionMute />
                    <OptionDelete />
                    <OptionEdit />
                </>
            }
        </div>
    )
}

export default MasterGroupOption