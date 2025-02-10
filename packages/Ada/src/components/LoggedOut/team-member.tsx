import Image from 'next/image';

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export function TeamMember({ name, role, image, bio }: TeamMemberProps) {
  return (
    <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-6 backdrop-blur-sm">
      <div className="flex items-center mb-4">
        <Image
          src={image || '/placeholder.svg'}
          alt={name}
          width={80}
          height={80}
          className="rounded-full mr-4"
        />
        <div>
          <h3 className="text-xl font-semibold text-white">{name}</h3>
          <p className="text-purple-400">{role}</p>
        </div>
      </div>
      <p className="text-gray-300">{bio}</p>
    </div>
  );
}
