import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import logo from '../assets/images/apconix-logo.png';

const Sidebar = () => {
  return (
    <div className={styles.mainContainer}>
      <img src={logo} className={styles.AppconixLogo}/>
      <h3 style = {{color: 'white', paddingLeft: '1rem'}}>Menu</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>
        <NavLink
          to="/PubMed"
          className={({ isActive }) =>
            isActive ? styles.menuItemSelected : styles.menuItem
          }
        >
          PubMed
        </NavLink>
        </li>

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
          to="/PMC"
          className={({ isActive }) =>
            isActive ? styles.menuItemSelected : styles.menuItem
          }
        >
          PMC
        </NavLink>
        </li>
        <li>
        <NavLink
          to="/History"
          className={({ isActive }) =>
            isActive ? styles.menuItemSelected : styles.menuItem
          }
        >
          Previous Queries
        </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;