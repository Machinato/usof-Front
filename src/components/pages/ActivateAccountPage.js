import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { activationAccount } from '../../api/auth';
import ErrorItem from "../ErrorItem";
import { toast } from "react-toastify";
import logoImage from "../../images/IML.png";
import HeaderItem from "../../components/Header/headerItem";
import "../../styles/AuthPage.css";

function ActivateAccountPage() {
    const [token, setToken] = useState("");
    const [errors, setError] = useState([]);
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const activateAccount = async (e) => {
        e.preventDefault();
        setError([]);
        setSuccess("");

        await activationAccount().then(response => {
            console.log(response.data.message)
            if(response.data.success === true){
                setSuccess(response.data.message);
                toast.success(success);
                navigate("/login")
                // setTimeout(() => navigate("/login"), 3000);
            }
            else {
                throw new Error(`${response.data.message}`)
            }

        }).catch(err => {
            setError(err.response?.data?.errors || [{msg: err.response.data.message}]);
            toast.error(errors);
        });
    };

    return (
        <div className='all-Page'>
            <HeaderItem/>
            <img className='AuthLogo' src={logoImage} alt="Logo" />
            <h1>Reset Your Password</h1>
            <form onSubmit={activateAccount}>
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
                </div>
                <br/>
                <button className="MyButton" type="submit">Activate account</button>
            </form>
        </div>
    );
}

export default ActivateAccountPage;
