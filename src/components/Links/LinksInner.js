//utils
import { getJsonAsDateTimeString } from "../../utils/DateTimeUtils";
//i18n
import i18n from "i18next";

const LinksInner = ({ links }) => {
    return (
        <div>
            {links
                ? links.map((link) =>
                    <div key={link.id}>
                        <a href={link.url} target="_blank">{link.urlText}</a>
                    </div>
                ) : '-'
            }
        </div>
    )
}

export default LinksInner
