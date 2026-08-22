import {useState} from 'react';
import {useEffect} from 'react';
import {useAuth} from '../../context/useAuth';
import UserCard from '../user-card/UserCard';
import styles from './People.module.css';

function People() {
    const [people, setPeople] = useState(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
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
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {fetchPeople()},[]);

    const filteredPeople = people
        ?.filter(person => person.username !== currentUsername)
        .filter(person => person.username.includes(search.trim().toLocaleLowerCase()));

    return (
        <div className={`${styles.container} ${styles.hideScrollbar}`}>
            
            <input type="text" className={styles.search} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search people…"/>

            {loading && <p className={styles.loading}>Loading…</p>}
            
            {!loading && people && (
                <>
                    <ul className={styles.list}>
                        {filteredPeople.map(person => (
                            <li key={person.id}><UserCard user={person} handleFollowChange={handleFollowChange} /></li>
                        ))}
                    </ul>

                    {filteredPeople.length === 0 && (
                        <p className={styles.empty}>No one matches "{search}"</p>
                    )}
                </>
            )}
        </div>
    )
}

export default People;