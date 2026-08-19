import {useState} from 'react';
import {useEffect} from 'react';
import {useAuth} from '../../context/useAuth';
import UserCard from '../user-card/UserCard';
import styles from './People.module.css';

function People() {
    const [people, setPeople] = useState(null);
    const currentUsername = useAuth().user.username;

    async function fetchPeople() {
        try {
            const res = await fetch('/api/users', {credentials: 'include'});
            if (res.status === 401) {
                return;
            }
            setPeople(await res.json());
        } catch (err) {
            console.log('Network error');
        }
    }

    useEffect(() => {fetchPeople()},[]);

    return (
        <div className={`${styles.container} ${styles.hideScrollbar}`}>
            {people && <>
                    <ul className={styles.list}>
                        {people.map(person => {
                            console.log(person.username);
                            console.log(person.username !== currentUsername);
                            return (person.username !== currentUsername) ? 
                                <li key={person.id}><UserCard user={person} /></li> 
                            : 
                            <></>
                        })}
                    </ul>
                </>
            }
        </div>
    )
}

export default People;