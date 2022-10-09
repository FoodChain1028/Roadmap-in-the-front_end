import staff from './img/staff.png';
import audience from './img/audience.png';
import { Link } from 'react-router-dom';
import { Buffer } from "buffer/";
window.Buffer = window.Buffer || require("buffer").Buffer;

const Home = () => {

    return ( 
        <div className="home">
            <div className='home-title'>Who Are You?</div>
            <Link to={'/Mint/Audience'} className="staff">
                Staff
                <img src={staff} alt="staff" />
            </Link>
            <Link to={'/Mint/Audience'} className="audience">
                Audience
                <img src={audience} alt="audience" />
            </Link>
        </div>
     );
}
 
export default Home;