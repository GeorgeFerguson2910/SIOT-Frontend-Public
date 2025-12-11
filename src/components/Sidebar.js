import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import logo from '../assets/images/apconix-logo.png';

const Sidebar = () => {
  return (
    <div className={styles.mainContainer}>
      <h3 style = {{color: 'white', paddingLeft: '1rem', fontFamily: "FontAwesome"}}>Menu</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>


        <li>
        <NavLink
          to="/Live-Plant"
          className={({ isActive }) =>
            isActive ? styles.menuItemSelected : styles.menuItem
          }
        >
          Live Plant
        </NavLink>
        </li>

        <li>
        <NavLink
          to="/History"
          className={({ isActive }) =>
            isActive ? styles.menuItemSelected : styles.menuItem
          }
        >
          Plant History
        </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;