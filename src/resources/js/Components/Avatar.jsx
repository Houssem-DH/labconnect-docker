
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

const AvatarDemo = ({ user, className = ''}) => {
    // Get the first letter of the username
    const initial = user.email.charAt(0).toUpperCase();

    return (
        <Avatar className={` ${className}`}>
            <AvatarImage
                src={`storage/${user.avatar}`}
                alt={`${user.email}'s avatar`}
                
            />
            <AvatarFallback> {initial}</AvatarFallback>
        </Avatar>
    );
}

export default AvatarDemo;