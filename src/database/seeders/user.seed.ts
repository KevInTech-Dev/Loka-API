import { User, UserCreationAttributes } from "@database/models/Users";
import { RoleEnum } from "@/enums/RoleEnum";
import { hashWord } from '@utils/password.utils';


const SEED_USERS: UserCreationAttributes[] = [
    {
        username: 'admin',
        email: 'admin@gmail.com',
        phoneNumber: '+22890000001',
        firstname: 'sul04',
        lastname: 'dev',
        password: 'Admin123!',
        role: RoleEnum.ADMIN,
        isActive: true,
        isEmailVerified: true,
        dateDebutSuspension: undefined,
        dateFinSuspension: undefined,
        profilePhotoUrl: undefined,
    },
    {
        username: 'landlord',
        email: 'landlord@mgmail.com',
        phoneNumber: '+22890000002',
        password: 'Landlord123!',
        firstname: 'kevin',
        lastname: 'dev',
        role: RoleEnum.PROPRIETAIRE,
        isActive: true,
        isEmailVerified: true,
        dateDebutSuspension: undefined,
        dateFinSuspension: undefined,
        profilePhotoUrl: undefined,
    },
    {
        username: 'tenant',
        email: 'tenant@gmail.com',
        phoneNumber: '+22890000003',
        password: 'Tenant123!',
        firstname: 'godwin',
        lastname: 'dev',
        role: RoleEnum.LOCATAIRE,
        isActive: true,
        isEmailVerified: true,
        dateDebutSuspension: undefined,
        dateFinSuspension: undefined,
        profilePhotoUrl: undefined,
    }
]

export const seedUsers = async (): Promise<void> => {
    console.log("Seeding users...");
    try {
        for (const userData of SEED_USERS) {
            const existing = await User.findOne({ where: { email: userData.email } });
            if (existing) {
                console.log(`  ⏭️  ${userData.email} exists, skipping`);
                continue;
            }

            const hashedPassword = await hashWord(userData.password);

            await User.create({
                ...userData,
                password: hashedPassword,
            });
            console.log(`  ✅ Created user: ${userData.email}`);
        }
    } catch (error) {
        console.error("Error seeding users:", error);
    }

}