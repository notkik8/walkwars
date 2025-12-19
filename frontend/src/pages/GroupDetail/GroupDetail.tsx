import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { groupsAPI } from '../../api/groups';
import type { Group } from '../../api/groups';
import { stepsAPI } from '../../api/steps';
import type { LeaderboardEntry } from '../../api/steps';
import Button from '../../components/Button/Button';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/Toast/Toast';
import './GroupDetail.css';

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stepCount, setStepCount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { toasts, showSuccess, showError, removeToast } = useToast();

  useEffect(() => {
    if (id) {
      loadGroupData();
      loadLeaderboard();
    }
  }, [id]);

  const loadGroupData = async () => {
    try {
      const groups = await groupsAPI.getGroups();
      const foundGroup = groups.find((g) => g.id === parseInt(id!));
      if (foundGroup) {
        setGroup(foundGroup);
      } else {
        setError('Команда не найдена');
      }
    } catch (err: any) {
      setError('Ошибка загрузки данных команды');
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    try {
      if (id) {
        const data = await stepsAPI.getLeaderboard(parseInt(id));
        setLeaderboard(data);
      }
    } catch (err: any) {
      console.error('Ошибка загрузки лидерборда:', err);
    }
  };

  const handleSubmitSteps = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !stepCount) return;

    setSubmitting(true);
    setError('');

    try {
      await stepsAPI.submitSteps(parseInt(id), {
        step_count: parseInt(stepCount),
      });
      setStepCount('');
      showSuccess('Шаги успешно отправлены!');
      await loadLeaderboard();
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Ошибка отправки шагов';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error && !group) {
    return (
      <div className="group-detail-page">
        <div className="container">
          <div className="error-message">{error}</div>
          <Button variant="secondary" onClick={() => navigate('/groups')}>
            Вернуться к командам
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group-detail-page">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="container">
        <motion.div
          className="group-detail-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button variant="ghost" onClick={() => navigate('/groups')}>
            ← Назад
          </Button>
          {group && (
            <div>
              <h1 className="gradient-text">{group.name}</h1>
              <p>Тип: {group.group_type} • Участников: {group.members?.length || 0}</p>
            </div>
          )}
        </motion.div>

        <div className="group-detail-content">
          <motion.div
            className="submit-steps-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2>Отправить шаги</h2>
            <form onSubmit={handleSubmitSteps} className="submit-steps-form">
              {error && (
                <div className="error-message">{error}</div>
              )}
              <div className="form-group">
                <label htmlFor="steps">Количество шагов</label>
                <input
                  id="steps"
                  type="number"
                  value={stepCount}
                  onChange={(e) => setStepCount(e.target.value)}
                  required
                  min="1"
                  placeholder="Введите количество шагов"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
              >
                {submitting ? 'Отправка...' : 'Отправить'}
              </Button>
            </form>
          </motion.div>

          <motion.div
            className="leaderboard-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2>Лидерборд</h2>
            {leaderboard.length === 0 ? (
              <div className="empty-leaderboard">
                <p>Пока нет записей. Будьте первым!</p>
              </div>
            ) : (
              <div className="leaderboard-list">
                {leaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.username}
                    className="leaderboard-item"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                  >
                    <div className="leaderboard-rank">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {!['🥇', '🥈', '🥉'].includes(
                        index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''
                      ) && <span className="rank-number">{index + 1}</span>}
                    </div>
                    <div className="leaderboard-info">
                      <span className="leaderboard-username">{entry.username}</span>
                      <span className="leaderboard-steps">
                        {entry.total_steps.toLocaleString()} шагов
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;

