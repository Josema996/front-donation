import { useState, useRef, useEffect } from "react";
import "./DonationForm.css";
import barAmbience from "./bar_ambience.mp3";

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import axios from "axios";

const DonationForm = () => {
    const [amount, setAmount] = useState(1);
    const [totalAmount, setTotalAmount] = useState(20);
    const [volume, setVolume] = useState(50);

    const [preferenceId, setPreferenceId] = useState(null);
    initMercadoPago('APP_USR-abd35d05-02ef-40c3-a878-84817f1c98a2');

    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play();
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    const handleButtonClick = (amount) => {
        setAmount(amount);
        setTotalAmount(amount * 20);
    }

    const handleInputChange = (e) => {
        setAmount(e.target.value);
        setTotalAmount(e.target.value * 20);
    }

    const handleVolumeChange = (value) => {
        setVolume(value);
    }

    //mercado pago functions
    const createPreferences = async () => {
        try{
            const response = await axios.post("https://server-donation.vercel.app/create_preference" , {
                description: "Gracias por la birra!",
                price: totalAmount,
                quantity: 1,
            });
            const { id } = response.data;
            return id;
        } catch (error) {
            console.log(error);
        }
    };

    const handleBuy = async () => {
        const id = await createPreferences();
        if (id) {
            setPreferenceId(id);
        }
    };

    return (
        <>
        <div className="donation-form-container">
            <div className="music-controls">
                <div className="music-label">Música</div>
                <input type="range" min="0" max="100" value={volume} onChange={(e) => handleVolumeChange(e.target.value)} />
            </div>

            <audio ref={audioRef} src={barAmbience} loop />

            <button type="button" className="donate-button" onClick={() => handleButtonClick(3)}> 3 🍻</button>
            <button type="button" className="donate-button" onClick={() => handleButtonClick(5)}> 5 🍻</button>
            <button type="button" className="donate-button" onClick={() => handleButtonClick(10)}> 10 🍻</button>

            <div className="input-container">
                <input type="number" className="donate-input" min="1" value={amount} onChange={handleInputChange} />
                <p className="donate-amount">Invitame a {amount} {amount === 1 ? "Cerveza $" : "Cervezas $"} {totalAmount}💖🍺</p>
            </div>
        </div>
        <div>
            <button className="donate-link" onClick={handleBuy}>Tomemos</button>
            {preferenceId && 
            <Wallet initialization={{ preferenceId }} />
            }
        </div>
        </>
    )
}

export default DonationForm;