import {useAuth} from '../../context/useAuth';
import {Navigate} from 'react-router';
import Feed from '../feed/Feed';

function Protected() {
    const {user, loading} = useAuth();

    if (loading) {
        return null; //put a spinner here later
    }

    if (!user) {
        return <Navigate to='/login' replace/>;
    }

    return <Feed />;
}

export default Protected;