import bcrypt from 'bcryptjs'
const users = [
    {
        name: 'Admin User',
        email: 'admin@gamil.com',
        password: bcrypt.hashSync('12345', 10),
        isAdmine: true

    },
    {
        name: 'Goldberg',
        email: 'gold@gamil.com',
        password: bcrypt.hashSync('12345', 10),
        isAdmine: true

    },
    {
        name: 'Brock Lesnar',
        email: 'brock@gamil.com',
        password: bcrypt.hashSync('12345', 10),
        isAdmine: true

    }
]

export default users