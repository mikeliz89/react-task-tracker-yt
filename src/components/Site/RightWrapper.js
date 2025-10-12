export default function RightWrapper({ children }) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'flex-end', // asettaa sisällön oikealle
                alignItems: 'center',       // keskittää pystysuunnassa
                gap: '8px',                 // väli nappeihin
            }}
        >
            {children}
        </div>
    );
}