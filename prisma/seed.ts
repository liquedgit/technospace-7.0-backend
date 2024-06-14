import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

import { v4 as uuidv4 } from 'uuid';
import { CreateRole } from '../src/repository/role.repository';
import { CreateUser } from '../src/repository/user.repository';

const prisma = new PrismaClient();


async function main() {
  const saltRounds = 11;
  
  await CreateRole({id: uuidv4(), name: "Agent"})
  const roleAdmin = await CreateRole({id: uuidv4(), name: "Admin"})
  const adminPassword = await hash("admin", saltRounds)
    await CreateUser({
        createdAt: new Date(),
        email : "mbe@binus.edu",
        id :uuidv4(),
        name : "Michael",
        password : adminPassword,
        profilePicture : "",
        roleId : roleAdmin.id
    })

  // !Debugging Purpose
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });