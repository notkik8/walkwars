import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { groupsAPI } from '../../api/groups';
import Button from '../../components/Button/Button';
import './CreateGroup.css';

const CreateGroup = () => {
  const [name, setName] = useState('');
  const [groupType, setGroupType] = useState('public');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const group = await groupsAPI.createGroup({
        name,
        group_type: groupType,
      });
      navigate(`/groups/${group.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка создания команды');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-group-page">
      <div className="container">
        <motion.div
          className="create-group-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="create-group-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="gradient-text">Создать команду</h1>
            <p>Создайте новую команду для соревнований</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="create-group-form">
            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {error}
              </motion.div>
            )}

            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="name">Название команды</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Введите название команды"
              />
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="groupType">Тип команды</label>
              <select
                id="groupType"
                value={groupType}
                onChange={(e) => setGroupType(e.target.value)}
                className="form-select"
              >
                <option value="Alliance">Альянс</option>
                <option value="Division">Дивизион</option>
                <option value="Squad">Сквад</option>
              </select>
            </motion.div>

            <motion.div
              className="form-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/groups')}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Создание...' : 'Создать команду'}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateGroup;

