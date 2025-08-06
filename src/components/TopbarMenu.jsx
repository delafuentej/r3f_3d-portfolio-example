import { config } from "../../config";

const TopbarMenu = () => {
  return (
    <div className="menu">
      <img src="logo.png" className="menu-logo" alt="logo" />
      <div className="menu-buttons">
        {config.sections.map((section, index) => (
          <a href={`#${section}`} key={index} className="menu-button">
            {section}
          </a>
        ))}
      </div>
    </div>
  );
};

export default TopbarMenu;
