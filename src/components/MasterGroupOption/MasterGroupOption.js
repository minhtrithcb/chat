import styles from './MasterGroupOption.module.scss'
import OptionEdit from './OptionEdit';
import OptionMute from './OptionMute';
import OptionDelete from './OptionDelete';
import OptionVote from './OptionVote';
import useDecodeJwt from '../../hooks/useDecodeJwt';
import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';

const MasterGroupOption = () => {
    const {currentChat } = useContext(ChatContext)
    const [currentUser] = useDecodeJwt()
    return (
        <div className={styles.groupOption}>
            {currentChat.owner === currentUser.id && 
                <>
                    <OptionMute />
                    <OptionDelete />
                    <OptionVote />
                    <OptionEdit />
                </>
            }
        </div>
    )
}

export default MasterGroupOption