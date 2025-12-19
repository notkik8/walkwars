import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/Toast/Toast';
import Button from '../../components/Button/Button';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { register, isAuthenticated } = useAuth();
  const { toasts, showError, removeToast } = useToast();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/account');
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      setFieldErrors({ password: 'Пароли не совпадают', confirmPassword: 'Пароли не совпадают' });
      return;
    }

    if (password.length < 4) {
      setError('Пароль должен быть не менее 4 символов');
      setFieldErrors({ password: 'Пароль должен быть не менее 4 символов' });
      return;
    }

    setLoading(true);

    try {
      await register({ username, email, password });
      navigate('/account');
    } catch (err: any) {
      const errorData = err.response?.data;
      const newFieldErrors: Record<string, string> = {};
      
      // Обработка ошибок валидации Pydantic
      if (Array.isArray(errorData?.detail)) {
        const validationErrors = errorData.detail;
        const errorMessages: string[] = [];
        
        validationErrors.forEach((error: any) => {
          const field = error.loc?.[error.loc.length - 1]; // Последний элемент - название поля
          const msg = error.msg;
          let userMessage = '';
          
          if (field === 'username') {
            if (error.type === 'string_too_long') {
              userMessage = 'Имя пользователя должно быть не более 15 символов';
            } else if (error.type === 'string_too_short') {
              userMessage = 'Имя пользователя должно быть не менее 4 символов';
            } else {
              userMessage = msg;
            }
            newFieldErrors.username = userMessage;
            errorMessages.push(userMessage);
          } else if (field === 'email') {
            if (error.type === 'value_error') {
              userMessage = 'Введите корректный email адрес';
            } else {
              userMessage = msg;
            }
            newFieldErrors.email = userMessage;
            errorMessages.push(userMessage);
          } else if (field === 'password') {
            userMessage = msg;
            newFieldErrors.password = userMessage;
            errorMessages.push(`Пароль: ${msg}`);
          } else {
            errorMessages.push(msg);
          }
        });
        
        setFieldErrors(newFieldErrors);
        const errorMessage = errorMessages.join('. ');
        setError(errorMessage);
        showError(errorMessage);
      } else {
        // Обычная ошибка
        const errorMessage = errorData?.detail || 'Ошибка регистрации. Попробуйте снова.';
        setError(errorMessage);
        showError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="auth-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="gradient-text">Создать аккаунт</h1>
          <p>Присоединяйтесь к WalkWars</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="auth-form">
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
            <label htmlFor="username">Имя пользователя</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (fieldErrors.username) {
                  setFieldErrors(prev => ({ ...prev, username: '' }));
                }
              }}
              required
              minLength={4}
              maxLength={15}
              placeholder="От 4 до 15 символов"
              className={fieldErrors.username ? 'input-error' : ''}
            />
            {fieldErrors.username && (
              <span className="field-error">{fieldErrors.username}</span>
            )}
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors(prev => ({ ...prev, email: '' }));
                }
              }}
              required
              placeholder="your@email.com"
              className={fieldErrors.email ? 'input-error' : ''}
            />
            {fieldErrors.email && (
              <span className="field-error">{fieldErrors.email}</span>
            )}
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors(prev => ({ ...prev, password: '' }));
                }
              }}
              required
              minLength={4}
              placeholder="Минимум 4 символа"
              className={fieldErrors.password ? 'input-error' : ''}
            />
            {fieldErrors.password && (
              <span className="field-error">{fieldErrors.password}</span>
            )}
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
          >
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword) {
                  setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
                }
              }}
              required
              placeholder="Повторите пароль"
              className={fieldErrors.confirmPassword ? 'input-error' : ''}
            />
            {fieldErrors.confirmPassword && (
              <span className="field-error">{fieldErrors.confirmPassword}</span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={loading}
              className="auth-submit"
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </motion.div>
        </form>

        <motion.div
          className="auth-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p>
            Уже есть аккаунт?{' '}
            <Link to="/login" className="auth-link">
              Войти
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;

