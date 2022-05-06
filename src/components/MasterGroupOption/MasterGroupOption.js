import styles from './MasterGroupOption.module.scss'
import OptionAdd from './OptionAdd';
import OptionNotify from './OptionNotify';
import OptionMute from './OptionMute';
import OptionDelete from './OptionDelete';
import OptionVote from './OptionVote';

const MasterGroupOption = () => {

    return (
        <div className={styles.groupOption}>
            <OptionNotify />
            <OptionMute />
            <OptionDelete />
            <OptionVote />
            <OptionAdd />
        </div>
    )
}

export default MasterGroupOption