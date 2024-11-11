import { isCorrectEmail } from "@/app/utils";
describe('Email Validation Tests', () => {
    const testCases = [
        {
            email: 'binh@gmail.com',
            expected: false,
            description: 'should reject non-hcmue domain'
        },
        {
            email: '4801104017@student.hcmue.edu.vn',
            expected: true,
            description: 'should accept student email'
        },
        {
            email: 'teacher@hcmue.edu.vn',
            expected: true,
            description: 'should accept staff email'
        }
    ];
    testCases.forEach(({ email, expected, description }) => {
        it(description, () => {
            expect(isCorrectEmail(email)).toBe(expected);
        })
    })
});