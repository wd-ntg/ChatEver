import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const realtimeRef = ref(getDatabase(), `users/${currentUser.uid}/notifications`);

    const unsubscribe = onValue(realtimeRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const notificationArray = Object.values(data);
        setNotifications(notificationArray);
      }
    });

    return () => {
      // Hủy đăng ký lắng nghe khi component unmount
      unsubscribe();
    };
  }, [currentUser.uid]);

  // Render thông báo
  return (
    <div>
      {notifications.map((notification) => (
        <div key={notification.timestamp}>
          <strong>{notification.title}</strong>: {notification.body}
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
