import { useContext } from 'react'; 
import { StaffContext } from '../store/StaffCtx.jsx';
import '../css/staff.css';

export default function Staff({ staffLabel }) {
 
  const {
    staffCountByRole,
    handleAddStaff,
    handleDecreaseStaff,
    handleResetStaff,
  } = useContext(StaffContext);

  const staffCount = staffCountByRole[staffLabel] ?? 0;

  return (
    <aside className="staff">  
      <div className="staff-count">
        <p><span>{ staffLabel }:</span> <span>{ staffCount }</span></p>
      </div>
      <div className="staff-cta"> 
        <button onClick={() => handleAddStaff(staffLabel)}>&#43;</button>
        <button onClick={() => handleDecreaseStaff(staffLabel)}>&minus;</button> 
        <button onClick={() => handleResetStaff(staffLabel)}>Reset</button> 
      </div>
    </aside>
  );
}