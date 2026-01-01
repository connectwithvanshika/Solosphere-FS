import { useState } from "react";
import EmergencyMode from "./EmergencyMode";
import "../styles/sos.css";

export default function SOSButton() {
    const [isActive, setIsActive] = useState(false);

    return (
        <>
            <div className="sos-button-fixed" onClick={() => setIsActive(true)}>
                <span style={{ fontSize: "24px" }}>🚨</span>
                <span className="sos-btn-text">SOS</span>
            </div>

            {isActive && <EmergencyMode onExit={() => setIsActive(false)} />}
        </>
    );
}
