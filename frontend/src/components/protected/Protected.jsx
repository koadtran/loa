import {useAuth} from '../../context/useAuth';
import {Navigate} from 'react-router';
import {Outlet} from 'react-router';
import Feed from '../feed/Feed';
import Home from '../home/Home';

function Protected() {
    const {user, loading} = useAuth();

    if (loading) {
        return null; //put a spinner here later
    }

    if (!user) {
        return <Navigate to='/login' replace/>;
    }

    return <Home><Outlet /></Home>;
}

export default Protected;