import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import UserTaskList from './UserTaskList';
import AddTaskDialog from './task/AddTaskDialog';

export default function UserAccordion({ user, toggle, deleteTask }) {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                <Typography component="span">{user.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <UserTaskList user={user} toggle={toggle} deleteTask={deleteTask} />
                <AddTaskDialog user={user} />
            </AccordionDetails>
        </Accordion>
    )
}

