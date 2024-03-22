import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {Box, Typography} from "@mui/material";
import {useState} from "react";
// import paper from '../../shared/icons/paper.png';

export default function SelectBox({title = 'Select player', items = [], onSelect}) {
    const handleChange = (event) => {
        onSelect(event.target.value);
    };

    return (
        <>
            <InputLabel id="demo-simple-select-standard-label">{title}</InputLabel>
            <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value=""
                label={title}
                onChange={handleChange}
            >
                <MenuItem value="" sx={{p: 1}}>
                    <em>None</em>
                </MenuItem>

                {items.map((item) => (<MenuItem sx={{my: 1}} key={item.value} value={item.value} sx={{'height': '50px', 'padding': '14px'}}>
                    <br/>
                    <Typography component='span' sx={{mr: 2}}>{item.label}</Typography>
                    <Box
                        component="img"
                        sx={{
                            height: 50,
                            width: 50,
                            borderRadius: 50,
                            maxHeight: {xs: 233, md: 167},
                            maxWidth: {xs: 350, md: 250},
                        }}
                        alt="The house from the offer."
                        src={item.icon}
                    />
                </MenuItem>))}
            </Select>
        </>
    );
}