import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button/Button';
import './Account.css';

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="account-page">
      <div className="container">
        <motion.div
          className="account-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="gradient-text">Мой аккаунт</h1>
          <p>Управляйте своим профилем и командами</p>
        </motion.div>

        <div className="account-content">
          <motion.div
            className="account-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2>Информация о профиле</h2>
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Имя пользователя:</span>
                <span className="info-value">{user?.username}</span>
              </div>
              {/*<div className="info-item">*/}
              {/*  <span className="info-label">Email:</span>*/}
              {/*  <span className="info-value">{user?.email}</span>*/}
              {/*</div>*/}
              {user?.created_at && (
                <div className="info-item">
                  <span className="info-label">Дата регистрации:</span>
                  <span className="info-value">
                    {new Date(user.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="account-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2>Быстрые действия</h2>
            <div className="quick-actions">
              <Button
                variant="primary"
                size="large"
                onClick={() => navigate('/groups')}
              >
                Мои команды
              </Button>
              <Button
                variant="secondary"
                size="large"
                onClick={() => navigate('/groups/create')}
              >
                Создать команду
              </Button>
              <Button
                variant="ghost"
                size="large"
                onClick={handleLogout}
              >
                Выйти
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Account;



