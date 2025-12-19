import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { groupsAPI } from '../../api/groups';
import type { Group } from '../../api/groups';
import Button from '../../components/Button/Button';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/Toast/Toast';
import './Groups.css';

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toasts, showSuccess, showError, removeToast } = useToast();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const data = await groupsAPI.getGroups();
      setGroups(data);
    } catch (err: any) {
      setError('Ошибка загрузки команд');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: number) => {
    try {
      await groupsAPI.joinGroup(groupId);
      showSuccess('Успешно присоединились к команде!');
      await loadGroups(); // Обновляем список
      setTimeout(() => {
        navigate(`/groups/${groupId}`);
      }, 1000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Ошибка присоединения к команде';
      showError(errorMessage);
    }
  };

  const handleLeaveGroup = async (groupId: number) => {
    try {
      const response = await groupsAPI.leaveGroup(groupId);
      showSuccess(`Вы вышли из команды. Удалено шагов: ${response.deleted_steps}`);
      await loadGroups(); // Обновляем список
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Ошибка выхода из команды';
      showError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="groups-page">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="container">
        <motion.div
          className="groups-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="gradient-text">Команды</h1>
            <p>Присоединяйтесь к командам и соревнуйтесь</p>
          </div>
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate('/groups/create')}
          >
            Создать команду
          </Button>
        </motion.div>

        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {groups.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>Пока нет команд. Создайте первую!</p>
            <Button
              variant="primary"
              onClick={() => navigate('/groups/create')}
            >
              Создать команду
            </Button>
          </motion.div>
        ) : (
          <div className="groups-grid">
            {groups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group-card-wrapper"
              >
                <div className={`group-card ${group.is_member ? 'group-card-member' : ''}`}>
                  <div className="group-card-header">
                    <div>
                      <h3>{group.name}</h3>
                      {group.is_member && (
                        <span className="member-badge">Вы участник</span>
                      )}
                    </div>
                    <span className="group-type">{group.group_type}</span>
                  </div>
                  <div className="group-card-info">
                    <p>Участников: {group.members?.length || 0}</p>
                    <p className="group-date">
                      Создана: {new Date(group.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <div className="group-card-actions">
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/groups/${group.id}`)}
                    >
                      Подробнее
                    </Button>
                    {group.is_member ? (
                      <Button
                        variant="error"
                        onClick={() => handleLeaveGroup(group.id)}
                      >
                        Выйти
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        Зайти
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;

