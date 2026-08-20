import {useState} from 'react';
import {useEffect} from 'react';
import {useAuth} from '../../context/useAuth';
import UserCard from '../user-card/UserCard';
import styles from './People.module.css';

function People() {
    const [people, setPeople] = useState(null);
    const {user} = useAuth();
    const currentUsername = user?.username;

    function handleFollowChange(username, state) {
        setPeople( prev =>
            prev.map(person => 
                (person.username === username) ? {...person, followed: state} : person
            )
        );
    } 

    async function fetchPeople() {
        try {
            const res = await fetch('/api/users', {credentials: 'include'});
            if (res.status === 401) {
                return;
            }
            setPeople(await res.json());
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {fetchPeople()},[]);

    return (
        <div className={`${styles.container} ${styles.hideScrollbar}`}>
            {people && <>
                    <ul className={styles.list}>
                        {people.filter(person => person.username !== currentUsername).map(person => <li key={person.id}><UserCard user={person} handleFollowChange={handleFollowChange} /></li> )}
                    </ul>
                </>
            }
        </div>
    )
}

export default People;