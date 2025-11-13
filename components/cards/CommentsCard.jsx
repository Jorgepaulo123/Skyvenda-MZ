export default function CommentsCard({product}) {
 return (
    <div className="absolute right-0 mt-2 w-60 rounded-lg bg-white shadow-xl border border-gray-100 py-2 animate-fadeIn z-50">

    <button className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3`} onClick={()=>handleNavigate('/login')}>
        <div>
          <p className="text-sm font-medium">Fazer Login</p>
        </div>
      </button>
      <button className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3`} onClick={()=>handleNavigate('/signup')}>
        <div>
          <p className="text-sm font-medium">Cadastra-se</p>
        </div>
      </button>

</div>
 );
}