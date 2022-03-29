export default function getCurrentAge(birthdate: string | null): string {
  if (!birthdate) {
    return "Age unknown"
  }

  const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return `${String(age)} years old`;
}