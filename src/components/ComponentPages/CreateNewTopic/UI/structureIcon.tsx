const StructureIcon = ({ fill = "", className = "" }) => {
  return (
    <div className={className}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.5 3.84375C4.5 3.37617 4.16562 3 3.75 3C3.33437 3 3 3.37617 3 3.84375V7.78125V16.7812C3 17.8676 3.78438 18.75 4.75 18.75H11V17.0625H4.75C4.6125 17.0625 4.5 16.9359 4.5 16.7812V8.625H11V6.9375H4.5V3.84375ZM13.5 9.1875V4.6875H14.8781L15.4094 5.28516C15.7094 5.62266 16.1156 5.8125 16.5406 5.8125H19.5V9.1875H13.5ZM12 4.125V9.75C12 10.3723 12.4469 10.875 13 10.875H20C20.5531 10.875 21 10.3723 21 9.75V5.25C21 4.62773 20.5531 4.125 20 4.125H16.5406C16.5156 4.125 16.4875 4.11445 16.4688 4.09336L15.7937 3.33047C15.6062 3.11953 15.3531 3 15.0875 3H13C12.4469 3 12 3.50273 12 4.125ZM13.5 19.3125V14.8125H14.8781L15.4094 15.4102C15.7094 15.7477 16.1156 15.9375 16.5406 15.9375H19.5V19.3125H13.5ZM12 14.25V19.875C12 20.4973 12.4469 21 13 21H20C20.5531 21 21 20.4973 21 19.875V15.375C21 14.7527 20.5531 14.25 20 14.25H16.5406C16.5156 14.25 16.4875 14.2395 16.4688 14.2184L15.7906 13.4555C15.6031 13.2445 15.35 13.125 15.0844 13.125H13C12.4469 13.125 12 13.6277 12 14.25Z"
          fill={fill}
        />
      </svg>
    </div>
  );
};

export default StructureIcon;