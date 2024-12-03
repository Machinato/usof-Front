import { useState } from "react";
import { resetPassToEmail } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import logoImage from "../../images/IML.png";
import HeaderItem from "../../components/Header/headerItem";
import "../../styles/AuthPage.css";

function ReminderPage() {
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const remindPassword = async (e) => {
        e.preventDefault();
        // setErrors(null)

        await resetPassToEmail(email).then(response => {
            if(response.data.success === true){
                navigate('/ResetPassword')
            }
            }).catch(err => {
            console.log(err.response.data.errors);
            setError(err.response.data.errors);
            toast.error(error)
            // error.forEach(err => toast.error(err))
        })
    }

    return (
        <div className='all-Page'>
            <HeaderItem/>
            <img className='AuthLogo' src={logoImage} alt="Logo" />
            <form onSubmit={remindPassword}>
            <div>
                    <label>Password reminder:</label>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button className="MyButton" type="submit">Remind</button>
                {/* <Link to={'/reset'}>Remind password</Link> */}
            </form>
        </div>
    )
}

export default ReminderPage;