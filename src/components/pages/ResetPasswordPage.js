import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPass } from '../../api/auth';
import ErrorItem from "../ErrorItem";
import { toast } from "react-toastify";
import logoImage from "../../images/IML.png";
import HeaderItem from "../../components/Header/headerItem";
import "../../styles/AuthPage.css";

function ResetPasswordPage() {
    // const { confirm_token } = useParams(); // Отримуємо токен з URL
    const [newPassword, setNewPassword] = useState("");
    const [token, setToken] = useState("");
    const [errors, setError] = useState([]);
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError([]);
        setSuccess("");

        await resetPass(token, newPassword).then(response => {
            console.log(response.data.message)
            if(response.data.success === true){
                setSuccess(response.data.message);
                setTimeout(() => navigate("/login"), 3000);
            }
            else {
                throw new Error(`${response.data.message}`)
            }

        }).catch(err => {
            setError(err.response?.data?.errors || [{msg: err.response.data.message}]);
            errors.forEach(err => toast.error(err.msg))
        });
    };

    return (
        <div className='all-Page'>
            <HeaderItem/>
            <img className='AuthLogo' src={logoImage} alt="Logo" />
            <h1>Reset Your Password</h1>
            {Array.isArray(errors) && errors.length > 0 ?  (
                errors.map((error, index) => <ErrorItem error={error} key={index} />)
            ) : (
                success && <p style={{ color: "green" }}>{success}</p>
            )}
            <form onSubmit={handleResetPassword}>
                <div>
                    <label>Token from email:</label>
                    <br/>
                    <input
                        type="Text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        required
                    />
                    <br/>
                    <br/>
                    <label>New Password:</label>
                    <br/>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    
                </div>
                <br/>
                <button className="MyButton" type="submit">Reset Password</button>
            </form>
        </div>
    );
}

export default ResetPasswordPage;
