import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../api/axios.js';

export const Notification = () => {
    const [notifications, setnotification] = useState([]);
    const { user } = useAuth();

    const fetchnoti = async () => {
        try {
            const res = await API.get('/notifications/');
            console.log(res.data.data);
            setnotification(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchnoti();
        }
    }, [user]);

    return (
        <div>
            <h2>Notifications</h2>
            {notifications ?<p>no notifications</p>:
            notifications.map((i) => (
                <div key={i._id}>
                    <p>{i.message}</p>
                    <button>Mark as settle</button>
                </div>
            ))}
        </div>
    );
};

export default Notification;